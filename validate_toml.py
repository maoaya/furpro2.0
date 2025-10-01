import toml

def validate_netlify_toml():
    """Valida la sintaxis del archivo netlify.toml"""
    try:
        with open('netlify.toml', 'r', encoding='utf-8') as f:
            toml_content = toml.load(f)
        
        print("✅ netlify.toml: Sintaxis VÁLIDA")
        print("\n📋 Configuración encontrada:")
        
        # Verificar secciones principales
        if 'build' in toml_content:
            print("   ✅ [build] - Configuración de build presente")
            build = toml_content['build']
            if 'command' in build:
                print(f"   📝 Build command: {build['command']}")
            if 'publish' in build:
                print(f"   📁 Publish dir: {build['publish']}")
        
        if 'build.environment' in toml_content:
            print("   ✅ [build.environment] - Variables de entorno configuradas")
        
        # Contar redirects
        redirects = toml_content.get('redirects', [])
        print(f"   🔄 Redirects configurados: {len(redirects)}")
        
        # Contar headers
        headers = toml_content.get('headers', [])
        print(f"   🛡️ Headers configurados: {len(headers)}")
        
        return True
        
    except toml.TomlDecodeError as e:
        print(f"❌ netlify.toml: Error de sintaxis TOML")
        print(f"   📝 Error: {e}")
        return False
    except FileNotFoundError:
        print("❌ netlify.toml: Archivo no encontrado")
        return False
    except Exception as e:
        print(f"❌ netlify.toml: Error inesperado - {e}")
        return False

if __name__ == "__main__":
    print("🔍 Validando netlify.toml...")
    validate_netlify_toml()