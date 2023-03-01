package com.printit.controller;

import com.printit.model.Cities;
import com.printit.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/city")
public class CityController {

    @Autowired // to get a instance --- provides more fine-grained control over where and how autowiring should be accomplished
    private CityRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Cities> customertypelist(){
        return dao.findAll();
    }
}
