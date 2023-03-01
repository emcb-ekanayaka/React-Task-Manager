package com.printit.controller;

import com.printit.model.Corderstatus;
import com.printit.repository.CorderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/customeroderstatus")
public class CustomerorderstatusController {

    @Autowired // to get a instance
    private CorderStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Corderstatus> corderstatusList(){
        return dao.findAll();
    }
}
