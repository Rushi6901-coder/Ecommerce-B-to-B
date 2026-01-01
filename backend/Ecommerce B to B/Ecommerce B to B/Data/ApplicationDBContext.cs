using Ecommerce_B_to_B.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_B_to_B.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
            : base(options)
        {
        }

        // =========================
        // USER TABLES
        // =========================
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Shopkeeper> Shopkeepers { get; set; }
        public DbSet<Location> Locations { get; set; }

        // =========================
        // PRODUCT TABLES
        // =========================
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Product> Products { get; set; }

        // =========================
        // CHAT TABLES
        // =========================
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<Message> Messages { get; set; }

        // =========================
        // ORDER TABLES
        // =========================
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // CATEGORY → SUBCATEGORY (CASCADE OK)
            // =========================
            modelBuilder.Entity<SubCategory>()
                .HasOne(sc => sc.Category)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(sc => sc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================
            // VENDOR → PRODUCT (NO CASCADE)
            // =========================
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.Products)
                .HasForeignKey(p => p.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // CATEGORY → PRODUCT (NO CASCADE)
            // =========================
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // SUBCATEGORY → PRODUCT (NO CASCADE)
            // =========================
            modelBuilder.Entity<Product>()
                .HasOne(p => p.SubCategory)
                .WithMany()
                .HasForeignKey(p => p.SubCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // CHATROOM → VENDOR (NO CASCADE)
            // =========================
            modelBuilder.Entity<ChatRoom>()
                .HasOne(c => c.Vendor)
                .WithMany(v => v.ChatRooms)
                .HasForeignKey(c => c.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // CHATROOM → SHOPKEEPER (NO CASCADE)
            // =========================
            modelBuilder.Entity<ChatRoom>()
                .HasOne(c => c.Shopkeeper)
                .WithMany(s => s.ChatRooms)
                .HasForeignKey(c => c.ShopkeeperId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // CHATROOM → MESSAGE (CASCADE OK)
            // =========================
            modelBuilder.Entity<Message>()
                .HasOne(m => m.ChatRoom)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ChatRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================
            // MESSAGE → ORDER (OPTIONAL, SET NULL)
            // =========================
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Order)
                .WithMany(o => o.Messages)
                .HasForeignKey(m => m.OrderId)
                .OnDelete(DeleteBehavior.SetNull);

            // =========================
            // ORDER → ORDER ITEMS (CASCADE OK)
            // =========================
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================
            // ORDER ITEM → PRODUCT (NO CASCADE)
            // =========================
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
