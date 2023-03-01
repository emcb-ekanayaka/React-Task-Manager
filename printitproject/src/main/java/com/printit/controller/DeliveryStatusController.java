package com.printit.controller;

import com.printit.model.Deliverystatus;
import com.printit.repository.DeliveryStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/deliverystatus")
public class DeliveryStatusController {

    @Autowired // to get a instance
    private DeliveryStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Deliverystatus> deliverystatuses(){
        return dao.findAll();
    }
}
