#!/usr/bin/env python3
"""
Ejecuta SQL directamente en Supabase usando el cliente Python
"""
import subprocess
import sys

# Leer el SQL
with open('FIX_RLS_POLICIES_FINAL.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Preparar el comando psql
commands = [
    'psql',
    '-h', 'qqrxetxcglwrejtblwut.supabase.co',
    '-U', 'postgres',
    '-d', 'postgres',
    '-c', sql_content
]

# Pasar password a través de variable de entorno
import os
os.environ['PGPASSWORD'] = 'UvfYTw7e59eVKmST'

# Ejecutar
result = subprocess.run(commands, capture_output=True, text=True)

print("STDOUT:")
print(result.stdout)
print("\nSTDERR:")
print(result.stderr)
print("\nReturn code:", result.returncode)

sys.exit(result.returncode)
