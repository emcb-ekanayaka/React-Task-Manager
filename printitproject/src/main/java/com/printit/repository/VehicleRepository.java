package com.printit.repository;

import com.printit.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    // to get the available delivery agent---> vehicle/listbyAddedDateofVehical?addeddate
    @Query(value="SELECT new Vehicle (v.id, v.vehiclename) FROM Vehicle v WHERE v.id not in (Select d.vehicle_id from Delivery d WHERE d.addeddate=:addeddate)")
    List findByaddedDateVehical(@Param("addeddate") LocalDate addeddate);

    @Query(value="SELECT new Vehicle (v.id, v.vehiclename, v.vehiclenumber) FROM Vehicle v where v.vtype_id.id=:vehicletypeid")
    List Listofvehicles(@Param("vehicletypeid") Integer vehicletypeid);

}
