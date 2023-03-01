package com.printit.controller;

import com.printit.model.Qrstatus;
import com.printit.repository.QuotationRequestStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/qrstatus")
public class QuotationRequestStatusController {

    @Autowired // to get a instance
    private QuotationRequestStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Qrstatus> qrstatusList(){
        return dao.findAll();
    }
}
