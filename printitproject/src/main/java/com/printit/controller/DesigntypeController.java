package com.printit.controller;

import com.printit.model.Dtype;
import com.printit.repository.DesigntypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/designtype")
public class DesigntypeController {

    @Autowired // to get a instance
    private DesigntypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Dtype> designerList(){
        return dao.findAll() ;
    }
}
