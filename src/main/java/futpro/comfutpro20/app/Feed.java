package futpro.comfutpro20.app;

import jakarta.persistence.*;

@Entity
/*
public class Feed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String descripcion;
    private Boolean archivado;
    private String tipo_usuario;
    private String usuario;
    private Integer valoracion;
    private Integer dificultad;
    // getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Boolean getArchivado() { return archivado; }
    public void setArchivado(Boolean archivado) { this.archivado = archivado; }
    public String getTipo_usuario() { return tipo_usuario; }
    public void setTipo_usuario(String tipo_usuario) { this.tipo_usuario = tipo_usuario; }
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public Integer getValoracion() { return valoracion; }
    public void setValoracion(Integer valoracion) { this.valoracion = valoracion; }
    public Integer getDificultad() { return dificultad; }
    public void setDificultad(Integer dificultad) { this.dificultad = dificultad; }
}
*/
public class Feed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String descripcion;
    private Boolean archivado;
    private String tipo_usuario;
    private String usuario;
    private Integer valoracion;
    private Integer dificultad;
    // getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Boolean getArchivado() { return archivado; }
    public void setArchivado(Boolean archivado) { this.archivado = archivado; }
    public String getTipo_usuario() { return tipo_usuario; }
    public void setTipo_usuario(String tipo_usuario) { this.tipo_usuario = tipo_usuario; }
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public Integer getValoracion() { return valoracion; }
    public void setValoracion(Integer valoracion) { this.valoracion = valoracion; }
    public Integer getDificultad() { return dificultad; }
    public void setDificultad(Integer dificultad) { this.dificultad = dificultad; }
}
