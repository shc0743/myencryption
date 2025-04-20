#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import readline  # 提供更好的输入体验
from encryption import encrypt_data, decrypt_data, encrypt_file, decrypt_file, change_file_password, export_master_key
from getpass import getpass

def get_multiline_input(prompt):
    """获取多行输入，直到用户输入Ctrl-D"""
    print(prompt)
    print("输入多行内容，按Ctrl-D(Unix)或Ctrl-Z(Windows)结束输入:")
    lines = []
    try:
        while True:
            line = input()
            lines.append(line)
    except EOFError:
        pass
    return '\n'.join(lines)

def get_password_with_empty_warning(prompt, allow_empty=True):
    """获取密码输入，如果允许空密码则增加警告提示"""
    while True:
        key = getpass(prompt)
        if not key and allow_empty:
            confirm = input("空密码不安全！您真的要使用空密码吗？(y/N) ").strip().lower()
            if confirm != 'y':
                continue  # 重新输入密码
        return key

def main():
    print("=== 安全加密解密工具 ===")
    print("1. 加密文本")
    print("2. 解密文本")
    print("3. 加密文件")
    print("4. 解密文件")
    print("5. 更改文件密码")
    print("6. 备份主密钥")
    print("7. 退出")
    
    while True:
        try:
            choice = input("\n> _ (1/2/3/4/5/6/7)\r\033[C\033[C").strip()
            
            if choice == '1':
                # 加密操作
                print("\n[加密模式]")
                plaintext = get_multiline_input("请输入要加密的文本:")
                
                key = get_password_with_empty_warning("请输入加密密钥: ")
                
                custom_phrase = input("可选: 输入自定义短语(留空使用随机): ").strip()
                custom_n = input("可选: 输入Scrypt的N参数(留空使用默认262144): ").strip()
                
                try:
                    n = int(custom_n) if custom_n else None
                    encrypted = encrypt_data(
                        plaintext, 
                        key, 
                        phrase=custom_phrase if custom_phrase else None,
                        N=n
                    )
                    print("\n加密成功! 结果如下:\n")
                    print(encrypted)
                    print("\n请妥善保存整个输出，解密时需要它。")
                except Exception as e:
                    print(f"加密失败: {str(e)}")
                
            elif choice == '2':
                # 解密操作
                print("\n[解密模式]")
                encrypted_data = getpass("请粘贴要解密的JSON数据，然后按下 Enter")
                key = get_password_with_empty_warning("请输入解密密钥: ")
                
                try:
                    decrypted = decrypt_data(encrypted_data, key)
                    print("\n解密成功! 结果如下:\n")
                    print(decrypted)
                except Exception as e:
                    print(f"解密失败: {str(e)}")
                
            elif choice == '3':
                # 加密文件
                print("\n[文件加密模式]")
                input_file = input("请输入要加密的文件路径: ").strip()
                output_file = input("请输入输出文件路径: ").strip()
                
                key = get_password_with_empty_warning("请输入加密密钥: ")
                if not key == getpass("再输一遍 please "):
                    print('似乎输错了，要不再试一遍?')
                    continue
                
                custom_phrase = input("可选: 输入自定义短语(留空使用随机): ").strip()
                custom_n = input("可选: 输入Scrypt的N参数(留空使用默认262144): ").strip()
                
                try:
                    n = int(custom_n) if custom_n else None
                    success = encrypt_file(
                        input_file,
                        output_file,
                        key,
                        phrase=custom_phrase if custom_phrase else None,
                        N=n
                    )
                    if success:
                        print(f"\n文件加密成功! 已保存到: {output_file}")
                except Exception as e:
                    print(f"文件加密失败: {str(e)}")
                
            elif choice == '4':
                # 解密文件
                print("\n[文件解密模式]")
                input_file = input("请输入要解密的文件路径: ").strip()
                output_file = input("请输入输出文件路径: ").strip()
                
                key = get_password_with_empty_warning("请输入解密密钥: ")
                
                try:
                    success = decrypt_file(input_file, output_file, key)
                    if success:
                        print(f"\n文件解密成功! 已保存到: {output_file}")
                except Exception as e:
                    print(f"文件解密失败: {(e)}")
                
            elif choice == '5':
                # 更改文件密码
                print("\n[更改文件密码模式]")
                file_path = input("请输入要修改密码的加密文件路径: ").strip()
                old_key = getpass("请输入原密码: ")
                new_key = get_password_with_empty_warning("请输入新密码: ")
                confirm_key = getpass("请再次输入新密码: ")
                
                if new_key != confirm_key:
                    print("两次输入的新密码不一致!")
                    continue
                
                try:
                    success = change_file_password(file_path, old_key, new_key)
                    if success:
                        print("\n文件密码修改成功!")
                except Exception as e:
                    print(f"密码修改失败: {str(e)}")
                
            elif choice == '6':
                # 备份主密钥
                print("\n[备份主密钥模式]")
                file_path = input("请输入加密文件路径: ").strip()
                current_key = getpass("请输入当前密码: ")
                export_key = get_password_with_empty_warning("请输入用于加密备份的密码: ")
                confirm_key = getpass("请再次输入加密备份的密码: ")
                
                if export_key != confirm_key:
                    print("两次输入的备份密码不一致!")
                    continue
                
                try:
                    encrypted_master_key = export_master_key(file_path, current_key, export_key)
                    print("\n主密钥备份成功! 请妥善保存以下内容:")
                    print(encrypted_master_key)
                except Exception as e:
                    print(f"备份失败: {str(e)}")
                
            elif choice == '7':
                print("再见!")
                sys.exit(0)
                
            else:
                print("无效选择，请输入1、2或3、4、5")
                
        except KeyboardInterrupt:
            print("\n操作已取消")
        except Exception as e:
            print(f"发生错误: {str(e)}")

if __name__ == "__main__":
    main()