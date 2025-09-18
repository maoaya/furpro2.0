
/*
package futpro.comfutpro20.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.Collections;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

// Importa tus clases de modelo y repositorio
import futpro.comfutpro20.app.Usuario;
import futpro.comfutpro20.app.UsuarioRepository;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Listar todos los usuarios sin paginación
    @GetMapping
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(Collections.singletonMap("usuarios", usuarioRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario usuario) {
        if (usuario.getEdad() < 12) return ResponseEntity.badRequest().body("Edad mínima 12 años");
        if (usuario.getEmail() == null || !usuario.getEmail().matches("^[^@]+@[^@]+\\.[^@]+$")) return ResponseEntity.badRequest().body("Email inválido");
        if (usuarioRepository.existsByEmail(usuario.getEmail())) return ResponseEntity.badRequest().body("Email ya registrado");
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    @GetMapping("/validar-email")
    public ResponseEntity<?> validarEmail(@RequestParam String email) {
        boolean unico = !usuarioRepository.existsByEmail(email);
        return ResponseEntity.ok(Collections.singletonMap("unico", unico));
    }

    // Listar usuarios con paginación y filtros
    @GetMapping("/paginado")
    public ResponseEntity<?> listarUsuariosPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String rol) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Usuario> usuarios = usuarioRepository.findUsuariosPaginado(nombre, rol, pageable);
        return ResponseEntity.ok(Collections.singletonMap("usuarios", usuarios.getContent()));
    }

    // Obtener perfil de usuario
    @GetMapping("/{id}/perfil")
    public ResponseEntity<?> obtenerPerfil(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(usuario);
    }
// ...el resto del código...

    // Actualizar perfil de usuario
    // Actualizar perfil de usuario

    @PutMapping("/{id}/perfil")
    public ResponseEntity<?> actualizarPerfil(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();
        if (data.containsKey("nombre")) usuario.setNombre((String)data.get("nombre"));
        // ...actualiza otros campos según sea necesario...
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }
    // Asignar rol a usuario

    @PutMapping("/{id}/rol")
    public ResponseEntity<?> asignarRol(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();
        usuario.setRol(body.get("rol"));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    // Bloquear usuario

    @PutMapping("/{id}/bloquear")
    public ResponseEntity<?> bloquearUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();
        usuario.setBloqueado(true);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    // Solicitar recuperación de contraseña

    @PostMapping("/recuperar")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) return ResponseEntity.badRequest().body("Email no registrado");
        // Enviar email de recuperación de contraseña
        // Suponiendo que tienes JavaMailSender configurado en tu proyecto
        // y que Usuario tiene un campo 'email'
        // usuario is checked for null above, safe to access getEmail()
        // String to = usuario.getEmail();
        // String text = "Haz clic en el siguiente enlace para recuperar tu contraseña: "
        //         + "https://tusitio.com/recuperar?email=" + usuario.getEmail();
        // Autowired JavaMailSender mailSender;
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(usuario.getEmail());
        // message.setSubject("Recuperación de contraseña");
        // message.setText(text);
        // mailSender.send(message);
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    // Cambiar contraseña

    @PutMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();
        usuario.setPassword(body.get("password"));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    // Endpoint para mensajes con adjunto

    @PostMapping("/mensajes/adjunto")
    public ResponseEntity<?> enviarMensajeConAdjunto(
            @RequestParam Long remitenteId,
            @RequestParam Long destinatarioId,
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) MultipartFile archivo) {
        // Guardar mensaje y archivo adjunto
        // Ejemplo simple: guardar archivo en carpeta local y registrar mensaje (ajusta según tu modelo)
        String archivoNombre = null;
        if (archivo != null && !archivo.isEmpty()) {
            try {
                archivoNombre = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
                java.nio.file.Path destino = java.nio.file.Paths.get("uploads").resolve(archivoNombre);
                java.nio.file.Files.createDirectories(destino.getParent());
                archivo.transferTo(destino.toFile());
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Collections.singletonMap("error", "Error al guardar archivo"));
            }
        }
        // Aquí deberías guardar el mensaje en la base de datos, incluyendo remitenteId, destinatarioId, texto y archivoNombre
        // Ejemplo: mensajeRepository.save(new Mensaje(remitenteId, destinatarioId, texto, archivoNombre));
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    // Reportar mensaje

    @PostMapping("/mensajes/{mensajeId}/reportar")
    public ResponseEntity<?> reportarMensaje(@PathVariable Long mensajeId, @RequestBody Map<String, String> body) {
        // Aquí deberías implementar la lógica para marcar el mensaje como reportado.
        // Ejemplo:
        // Mensaje mensaje = mensajeRepository.findById(mensajeId).orElse(null);
        // if (mensaje == null) return ResponseEntity.notFound().build();
        // mensaje.setReportado(true);
        // mensajeRepository.save(mensaje);
        // return ResponseEntity.ok(Collections.singletonMap("ok", true));
        // Por ahora, solo retorna ok.
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    @PostMapping("/validar")
    public ResponseEntity<?> validarDato(@RequestBody Map<String, String> body) {
        String tipo = body.get("tipo");
        String valor = body.get("valor");
        switch (tipo) {
            case "email":
                boolean emailValido = valor != null && valor.matches("^[^@]+@[^@]+\\.[^@]+$");
                boolean emailUnico = !usuarioRepository.existsByEmail(valor);
                return ResponseEntity.ok(Collections.singletonMap("valido", emailValido && emailUnico));
            case "usuario":
                boolean usuarioUnico = !usuarioRepository.existsByNombre(valor);
                return ResponseEntity.ok(Collections.singletonMap("unico", usuarioUnico));
            case "password":
                boolean passwordValida = valor != null && valor.length() >= 8;
                return ResponseEntity.ok(Collections.singletonMap("valido", passwordValida));
            // ...agrega más validaciones si lo necesitas...
            default:
                return ResponseEntity.badRequest().body(Collections.singletonMap("result", "Tipo de validación no soportado"));
        }
    }

    // Validador web: también acepta GET para validaciones rápidas

    @GetMapping("/validar")
    public ResponseEntity<?> validarDatoGet(
        @RequestParam String tipo,
        @RequestParam String valor
    ) {
        switch (tipo) {
            case "email":
                boolean emailValido = valor != null && valor.matches("^[^@]+@[^@]+\\.[^@]+$");
                boolean emailUnico = !usuarioRepository.existsByEmail(valor);
                return ResponseEntity.ok(Collections.singletonMap("valido", emailValido && emailUnico));
            case "usuario":
                boolean usuarioUnico = !usuarioRepository.existsByNombre(valor);
                return ResponseEntity.ok(Collections.singletonMap("unico", usuarioUnico));
            case "password":
                boolean passwordValida = valor != null && valor.length() >= 8;
                return ResponseEntity.ok(Collections.singletonMap("valido", passwordValida));
            default:
                return ResponseEntity.badRequest().body(Collections.singletonMap("result", "Tipo de validación no soportado"));
        }
    }
}
*/
