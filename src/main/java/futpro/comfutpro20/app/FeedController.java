/*
package futpro.comfutpro20.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/feed")
public class FeedController {
    @Autowired
    private FeedRepository feedRepository;

    @GetMapping
    public List<Feed> getAll() {
        return feedRepository.findAll();
    }

    @PostMapping
    public Feed create(@RequestBody Feed nuevo) {
        return feedRepository.save(nuevo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        feedRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}")
    public Feed archivar(@PathVariable Long id, @RequestBody Feed cambios) {
        Optional<Feed> f = feedRepository.findById(id);
        if (f.isPresent()) {
            Feed pub = f.get();
            if (cambios.getArchivado() != null) pub.setArchivado(cambios.getArchivado());
            return feedRepository.save(pub);
        }
        throw new RuntimeException("No encontrado");
    }
}
*/
/*
    @Autowired
    private FeedRepository feedRepository;

    @GetMapping
    public List<Feed> getAll() {
        return feedRepository.findAll();
    }

    @PostMapping
    public Feed create(@RequestBody Feed nuevo) {
        return feedRepository.save(nuevo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        feedRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}")
    public Feed archivar(@PathVariable Long id, @RequestBody Feed cambios) {
        Optional<Feed> f = feedRepository.findById(id);
        if (f.isPresent()) {
            Feed pub = f.get();
            if (cambios.getArchivado() != null) pub.setArchivado(cambios.getArchivado());
            return feedRepository.save(pub);
        }
        throw new RuntimeException("No encontrado");
    }
*/
