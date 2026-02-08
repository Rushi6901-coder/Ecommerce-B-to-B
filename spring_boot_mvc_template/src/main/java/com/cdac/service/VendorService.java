package com.cdac.service;

import com.cdac.dto.VendorDto;
import com.cdac.entity.Vendor;
import com.cdac.repository.VendorRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    @Transactional
    public Vendor updateVendor(Long id, VendorDto dto) {
        Vendor vendor = getVendorById(id);
        
        if (dto.getBusinessName() != null) {
            vendor.setShopName(dto.getBusinessName());
        }
        if (dto.getBusinessCategory() != null) {
            vendor.setBusinessCategory(dto.getBusinessCategory());
        }
        if (dto.getGstNumber() != null) {
            vendor.setGstNumber(dto.getGstNumber());
        }
        
        return vendorRepository.save(vendor);
    }

    @Transactional
    public void deleteVendor(Long id) {
        if (!vendorRepository.existsById(id)) {
            throw new RuntimeException("Vendor not found");
        }
        vendorRepository.deleteById(id);
    }

	public List<Vendor> getVendorAll() {
		return vendorRepository.findAll();
	}
}
