#!/usr/bin/env python3
"""
写真追加を自動化するスクリプト
使い方:
  python add_photos.py new_event --name "2025-08-01 夏祭り" --date "2025-08-01" --description "夏の思い出を写真に残しました。" --photos "/path/to/photos/"
  python add_photos.py add_photos --event "20250501-spring-marche" --photos "/path/to/photos/"
"""

import os
import json
import shutil
import argparse
from datetime import datetime
from pathlib import Path
from PIL import Image
import sys

def create_event_id(name, date):
    """イベント名と日付からイベントIDを生成"""
    date_str = date.replace('-', '')
    # 日本語を含む場合は手動で指定してもらう
    return f"{date_str}-event"

def optimize_image(input_path, output_path, target_size=(800, 600), quality=85):
    """画像を最適化"""
    try:
        with Image.open(input_path) as img:
            # RGBに変換（JPEGの場合）
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # リサイズ（アスペクト比を保持）
            img.thumbnail(target_size, Image.Resampling.LANCZOS)
            
            # 4:3比率に調整（必要に応じて）
            if target_size[0] / target_size[1] != img.width / img.height:
                # 中央でクロップ
                ratio = min(target_size[0] / img.width, target_size[1] / img.height)
                new_width = int(img.width * ratio)
                new_height = int(img.height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # 中央配置で4:3キャンバスに配置
                canvas = Image.new('RGB', target_size, (255, 255, 255))
                x = (target_size[0] - new_width) // 2
                y = (target_size[1] - new_height) // 2
                canvas.paste(img, (x, y))
                img = canvas
            
            # 保存
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            return True
    except Exception as e:
        print(f"画像処理エラー: {input_path} - {e}")
        return False

def load_events():
    """events.jsonを読み込み"""
    try:
        with open('events.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_events(events):
    """events.jsonに保存"""
    with open('events.json', 'w', encoding='utf-8') as f:
        json.dump(events, f, ensure_ascii=False, indent=2)

def load_photo_list(event_id):
    """写真リストJSONを読み込み"""
    try:
        with open(f'{event_id}.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_photo_list(event_id, photos):
    """写真リストJSONに保存"""
    with open(f'{event_id}.json', 'w', encoding='utf-8') as f:
        json.dump(photos, f, ensure_ascii=False, indent=2)

def get_unique_filename(existing_photos, original_name):
    """既存の写真リストから重複しない名前を生成"""
    base_name = original_name
    counter = 1
    
    while base_name in existing_photos:
        name_parts = original_name.rsplit('.', 1)
        if len(name_parts) == 2:
            base_name = f"{name_parts[0]}_{counter}.{name_parts[1]}"
        else:
            base_name = f"{original_name}_{counter}"
        counter += 1
    
    return base_name

def create_new_event(args):
    """新しいイベントを作成"""
    event_id = args.event_id or create_event_id(args.name, args.date)
    
    # events.jsonに追加
    events = load_events()
    
    # 既存チェック
    if any(e['id'] == event_id for e in events):
        print(f"エラー: イベントID '{event_id}' は既に存在します")
        return False
    
    new_event = {
        "id": event_id,
        "name": args.name,
        "date": args.date,
        "description": args.description or f"{args.name}の写真です。"
    }
    
    events.append(new_event)
    save_events(events)
    
    # フォルダ作成
    photos_dir = Path(f"photos/{event_id}")
    photos_dir.mkdir(parents=True, exist_ok=True)
    
    # 写真リストファイルを作成
    save_photo_list(event_id, [])
    
    # 写真処理
    if args.photos:
        add_photos_to_event(event_id, args.photos, args.prefix)
    
    print(f"✅ 新しいイベント '{event_id}' を作成しました")
    return True

def add_photos_to_event(event_id, photos_path, prefix="IMG"):
    """既存イベントに写真を追加"""
    photos_dir = Path(f"photos/{event_id}")
    
    if not photos_dir.exists():
        print(f"エラー: イベントディレクトリが存在しません: {photos_dir}")
        return False
    
    # 既存の写真リスト読み込み
    existing_photos = load_photo_list(event_id)
    
    # 写真ファイルを処理
    photos_path = Path(photos_path)
    if not photos_path.exists():
        print(f"エラー: 写真ディレクトリが存在しません: {photos_path}")
        return False
    
    supported_formats = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
    photo_files = [f for f in photos_path.iterdir() 
                   if f.is_file() and f.suffix.lower() in supported_formats]
    
    if not photo_files:
        print("エラー: 処理可能な画像ファイルが見つかりません")
        return False
    
    # 写真を処理
    processed_count = 0
    for photo_file in sorted(photo_files):
        # 元のファイル名を保持（拡張子をjpgに変更）
        original_name = photo_file.stem + '.jpg'
        output_filename = get_unique_filename(existing_photos, original_name)
        output_path = photos_dir / output_filename
        
        print(f"処理中: {photo_file.name} -> {output_filename}")
        
        if optimize_image(photo_file, output_path):
            existing_photos.append(output_filename)
            processed_count += 1
        else:
            print(f"⚠️  スキップ: {photo_file.name}")
    
    # 写真リストを保存
    save_photo_list(event_id, existing_photos)
    
    print(f"✅ {processed_count}枚の写真を追加しました")
    return True

def main():
    parser = argparse.ArgumentParser(description="写真追加を自動化するスクリプト")
    subparsers = parser.add_subparsers(dest='command', help='コマンド')
    
    # 新しいイベント作成
    new_parser = subparsers.add_parser('new_event', help='新しいイベントを作成')
    new_parser.add_argument('--name', required=True, help='イベント名')
    new_parser.add_argument('--date', required=True, help='日付 (YYYY-MM-DD)')
    new_parser.add_argument('--description', help='イベントの説明')
    new_parser.add_argument('--event-id', help='イベントID（省略時は自動生成）')
    new_parser.add_argument('--photos', help='写真フォルダのパス')
    new_parser.add_argument('--prefix', default='IMG', help='写真ファイルの接頭辞')
    
    # 既存イベントに写真追加
    add_parser = subparsers.add_parser('add_photos', help='既存イベントに写真を追加')
    add_parser.add_argument('--event', required=True, help='イベントID')
    add_parser.add_argument('--photos', required=True, help='写真フォルダのパス')
    add_parser.add_argument('--prefix', default='IMG', help='写真ファイルの接頭辞')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # 必要なモジュールをチェック
    try:
        from PIL import Image
    except ImportError:
        print("エラー: Pillowがインストールされていません")
        print("インストール: pip install Pillow")
        return
    
    if args.command == 'new_event':
        create_new_event(args)
    elif args.command == 'add_photos':
        add_photos_to_event(args.event, args.photos, args.prefix)

if __name__ == '__main__':
    main()