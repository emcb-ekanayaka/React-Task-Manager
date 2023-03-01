package com.printit.controller;


import com.printit.model.Designation;
import com.printit.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/designation")
public class DesignationController {

    @Autowired // to get a instance
    private DesignationRepository dao;


    @GetMapping(value = "/list", produces = "application/json")
    public List<Designation> designations() {
        return dao.list();
    }



}
