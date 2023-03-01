package com.printit.repository;

import com.printit.model.Productionstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionOrderStatusRepository extends JpaRepository<Productionstatus, Integer> {
}
