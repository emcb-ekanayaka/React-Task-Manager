package com.printit.controller;

import com.printit.model.Unit;
import com.printit.repository.MaterialUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/materialunit")
public class MaterialUnitController {

    @Autowired // to get a instance
    private MaterialUnitRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Unit> materialCategorylist(){
        return dao.findAll();
    }
}
