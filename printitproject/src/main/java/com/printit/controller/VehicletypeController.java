package com.printit.controller;

import com.printit.model.Vehicletype;
import com.printit.repository.VehicletypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/vtype")
public class VehicletypeController {

    @Autowired // to get a instance
    private VehicletypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Vehicletype> vehicletypeList(){
        return dao.findAll();
    }


}
