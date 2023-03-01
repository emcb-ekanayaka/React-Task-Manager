package com.printit.controller;


import com.printit.model.Customertype;
import com.printit.repository.CustomertypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/customertype")
public class CustomertypeController {

    @Autowired // to get a instance
    private CustomertypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Customertype> customertypelist(){
        return dao.findAll();
    }
}
