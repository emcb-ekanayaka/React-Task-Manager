package com.printit.controller;

import com.printit.model.Materialstatus;
import com.printit.repository.MaterialStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/materialstatus")
public class MaterialStatusController {

    @Autowired // to get a instance
    private MaterialStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Materialstatus> materialCategorylist(){
        return dao.findAll();
    }
}
