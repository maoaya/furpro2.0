/*
package futpro.comfutpro20.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

// Asegúrate de que estas clases existan y estén en el paquete correcto
import futpro.comfutpro20.app.DemoCard;
import futpro.comfutpro20.app.DemoCardsRepository;

@RestController
@RequestMapping("/demo_cards")
public class DemoCardsController {
    @Autowired
    private DemoCardsRepository demoCardsRepository;

    @GetMapping
    public List<DemoCard> getAll() {
        return demoCardsRepository.findAll();
    }

    @PostMapping
    public DemoCard upsert(@RequestBody DemoCard card) {
        // upsert: si existe (por usuario_tipo y fecha), actualiza; si no, crea
        return demoCardsRepository.save(card);
    }
}
*/

