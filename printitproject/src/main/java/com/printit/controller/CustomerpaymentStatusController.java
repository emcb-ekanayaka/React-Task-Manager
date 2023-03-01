package com.printit.controller;

import com.printit.model.Custmerpaystatus;
import com.printit.repository.CustomerpayStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/customerpaystatus")
public class CustomerpaymentStatusController {

    @Autowired // to get a instance
    private CustomerpayStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Custmerpaystatus> custmerpaystatusList(){
        return dao.findAll();
    }
}
