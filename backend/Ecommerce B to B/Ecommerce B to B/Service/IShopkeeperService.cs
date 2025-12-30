using Ecommerce_B_to_B.DTOs;
using Ecommerce_B_to_B.Models;

public interface IShopkeeperService
{
    Task<Shopkeeper> RegisterAsync(RegisterShopkeeperDto dto);
    Task<Shopkeeper> LoginAsync(LoginShopkeeperDto dto);
    Task<List<Vendor>> GetVendorsAsync();
    Task<List<Product>> GetVendorProductsAsync(int vendorId);
    Task<ChatRoom> StartChatAsync(StartChatDto dto);
}