package com.printit.repository;

import com.printit.model.Deliverystatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryStatusRepository extends JpaRepository<Deliverystatus, Integer> {
}
