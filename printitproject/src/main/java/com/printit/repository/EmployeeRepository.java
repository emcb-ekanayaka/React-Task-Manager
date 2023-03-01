package com.printit.repository;

import com.printit.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query(value="SELECT * FROM Employee e where e.callingname = ?1", nativeQuery=true)
    List<Employee> lists(String caname);


  @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e")
  List<Employee> list();

    @Query(value = "SELECT max(e.number) FROM Employee e")
    String getNextNumber();

    @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e WHERE e not in (Select u.employeeId from User u)")
    List<Employee> listWithoutUsers();

    @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e WHERE e in (Select u.employeeId from User u)")
    List<Employee> listWithUseraccount();

    @Query("SELECT e FROM Employee e where e.callingname <> 'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(Pageable of);

    @Query("SELECT e FROM Employee e where (e.callingname like concat('%',:searchtext,'%')) and e.callingname<>'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(@Param("searchtext") String searchtext , Pageable of);

   @Query("SELECT e FROM Employee e WHERE e.nic= :nic")
    Employee findByNIC(@Param("nic") String nic);

    @Query("SELECT e FROM Employee e WHERE e.number= :number")
    Employee findByNumber(@Param("number") String number);

    // to get the available delivery riders ---> employee/listbyAddedDateofdelivery?addeddate
    @Query(value="SELECT new Employee(e.id,e.fullname) FROM Employee e WHERE e.designationId.id=10 and e.id not in (Select d.driver_employee_id.id from Delivery d WHERE d.addeddate=:addeddate)")
    List findByaddedDate(@Param("addeddate") LocalDate addeddate);

    // to get the available delivery agent---> employee/listbyAddedDateofdelivery?addeddate
    @Query(value="SELECT new Employee(e.id,e.fullname) FROM Employee e WHERE e.designationId.id=11 and e.id not in (Select d.deliveryagent_employee_id.id from Delivery d WHERE d.addeddate=:addeddate)")
    List findByaddedDateagents(@Param("addeddate") LocalDate addeddate);

}
