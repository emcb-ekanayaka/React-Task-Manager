package com.printit.controller;

import com.printit.model.Dstatus;
import com.printit.repository.DesignstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/designstatus")
public class DesignstatusController {

    @Autowired // to get a instance
    private DesignstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Dstatus> designstatusList(){
        return dao.findAll() ;
    }
}
