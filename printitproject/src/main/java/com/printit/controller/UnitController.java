package com.printit.controller;

import com.printit.model.Unit;
import com.printit.repository.UnitlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/unit")
public class UnitController {

    @Autowired  // to get a instance
    private UnitlRepository dao;

    @GetMapping(value = "/listbymaterial", params = {"materialid"} , produces = "application/json")
    public List<Unit>unitList(@RequestParam("materialid") Integer materialid){
        return dao.ListByMaterial(materialid);
    }
}
