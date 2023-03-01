package com.printit.repository;

import com.printit.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialUnitRepository extends JpaRepository<Unit , Integer> {
}
