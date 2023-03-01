package com.printit.controller;

import com.printit.model.Vehiclestatus;
import com.printit.repository.VehiclestatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/vstatus")
public class VehiclestatusController {

    @Autowired // to get a instance
    private VehiclestatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Vehiclestatus> vehiclestatusList(){
        return dao.findAll();
    }
}
