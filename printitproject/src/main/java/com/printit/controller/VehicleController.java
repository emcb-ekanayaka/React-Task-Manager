package com.printit.controller;

import com.printit.model.Vehicle;
import com.printit.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/vehicle")
public class VehicleController {

    @Autowired // to get a instance
    private VehicleRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Vehicle> vehicleList(){
        return dao.findAll();
    }

    // vehicle/listbyAddedDateofVehical?addeddate
    @GetMapping(value = "/listbyAddedDateofVehical" ,params = {"addeddate"}, produces = "application/Json")
    List vehicalList(@RequestParam("addeddate") String addeddate){
        return dao.findByaddedDateVehical(LocalDate.parse(addeddate));
    }

    // vehicle/listofvehicles
    @GetMapping(value = "/listofvehicles" ,params = {"vehicletypeid"}, produces = "application/Json")
    List ListofVehicles(@RequestParam("vehicletypeid") Integer vehicletypeid){
        return dao.Listofvehicles(vehicletypeid);
    }
}
