package com.printit.controller;

import com.printit.model.Paymenttype;
import com.printit.repository.PaymenttypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/paymenttype")
public class PaymettypeController {

    @Autowired // to get a instance
    private PaymenttypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Paymenttype> paymethodList(){
        return dao.findAll();
    }
}
