package com.printit.repository;

import com.printit.model.Inventorystatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialInventoryStatusRepository extends JpaRepository<Inventorystatus, Integer> {
}
