package com.printit.controller;

import com.printit.model.Grnstatus;
import com.printit.repository.GrnStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/grnstatus")
public class GrnStatusController {

    @Autowired // to get a instance
    private GrnStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Grnstatus> grnstatuses(){
        return dao.findAll();
    }
}
