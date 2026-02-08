package com.cdac.service;

import java.util.List;
import com.cdac.dto.ShopkeeperDto;
import com.cdac.entity.Shopkeeper;
import com.cdac.repository.ShopkeeperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShopkeeperService {

    @Autowired
    private ShopkeeperRepository shopkeeperRepository;

    public Shopkeeper getShopkeeperById(Long id) {
        return shopkeeperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
    }

    public Shopkeeper updateShopkeeper(Long id, ShopkeeperDto dto) {
        Shopkeeper shopkeeper = getShopkeeperById(id);

        if (dto.getShopName() != null) {
            shopkeeper.setShopName(dto.getShopName());
        }
        if (dto.getShopAddress() != null) {
            shopkeeper.setShopAddress(dto.getShopAddress());
        }
        if (dto.getLicenseNumber() != null) {
            shopkeeper.setLicenseNumber(dto.getLicenseNumber());
        }

        return shopkeeperRepository.save(shopkeeper);
    }

    public void deleteShopkeeper(Long id) {
        if (!shopkeeperRepository.existsById(id)) {
            throw new RuntimeException("Shopkeeper not found");
        }
        shopkeeperRepository.deleteById(id);
    }

	public List<Shopkeeper> getShopKeeperAll() {
		return shopkeeperRepository.findAll();
	}
}
