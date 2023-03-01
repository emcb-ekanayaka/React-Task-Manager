package com.printit.controller;


import com.printit.model.QuotationHasMaterial;
import com.printit.repository.QuatationHasMaterialRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController //To set the class readable
@RequestMapping(value = "/quatationhasmaterial")
public class QuatationHasMaterialController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private QuatationHasMaterialRepository dao;


    @GetMapping(value = "/byquatationhasmaterial" ,params ={"quotationid", "materialid"}, produces = "application/Json") //values type will return as a json object.
    public QuotationHasMaterial findAll(@RequestParam("quotationid") int quotationid , @RequestParam("materialid") int materialid){
        return dao.listbyquotionmaterial(quotationid, materialid);
    }

}
