package com.printit.controller;


import com.printit.model.PorderHasMaterial;
import com.printit.repository.PorderHasMaterialRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController //To set the class readable
@RequestMapping(value = "/porderhasmaterial")
public class PorderHasMaterialController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private PorderHasMaterialRepository dao;


    @GetMapping(value = "/byporderhasmaterial" ,params ={"porderid", "materialid"}, produces = "application/Json") //values type will return as a json object.
    public PorderHasMaterial findAll(@RequestParam("porderid") int porderid , @RequestParam("materialid") int materialid){
        return dao.listbypordermaterial(porderid, materialid);
    }

}
