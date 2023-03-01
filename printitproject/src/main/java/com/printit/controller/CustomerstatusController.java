package com.printit.controller;

import com.printit.model.Customerstatus;
import com.printit.repository.CustomerstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/customerstatus")
public class CustomerstatusController {

    @Autowired // to get a instance
    private CustomerstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Customerstatus> customerstatuslist(){

        return dao.findAll();
    }
}
