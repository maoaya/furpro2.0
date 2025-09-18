/*
package futpro.comfutpro20.app;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email);
    boolean existsByNombre(String nombre);
    Usuario findByEmail(String email);

    // Método para paginación y filtros usando Pageable
    @Query("SELECT u FROM Usuario u WHERE (:nombre IS NULL OR u.nombre LIKE %:nombre%) AND (:rol IS NULL OR u.rol = :rol)")
    Page<Usuario> findUsuariosPaginado(@Param("nombre") String nombre, @Param("rol") String rol, Pageable pageable);
}
*/
