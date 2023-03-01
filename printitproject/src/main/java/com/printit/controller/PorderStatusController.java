package com.printit.controller;

import com.printit.model.Porderstatus;
import com.printit.repository.PorderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/porderstatus")
public class PorderStatusController {

    @Autowired // to get a instance
    private PorderStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Porderstatus> porderstatusList(){
        return dao.findAll();
    }
}
