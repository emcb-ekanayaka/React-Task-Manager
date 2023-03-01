package com.printit.controller;

import com.printit.model.Customtype;
import com.printit.repository.CustomtypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController//to read the class file
@RequestMapping(value = "/customtype")
public class CustomController {

    @Autowired // to get a instance
    private CustomtypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Customtype> customtypeList (){
        return dao.findAll();
    }
}
