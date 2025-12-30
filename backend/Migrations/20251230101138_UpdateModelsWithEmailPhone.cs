using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce_B_to_B.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelsWithEmailPhone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Vendors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Vendors",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Vendors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Vendors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Shopkeepers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Shopkeepers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Shopkeepers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Shopkeepers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vendors_LocationId",
                table: "Vendors",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Shopkeepers_LocationId",
                table: "Shopkeepers",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shopkeepers_Locations_LocationId",
                table: "Shopkeepers",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_Locations_LocationId",
                table: "Vendors",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "LocationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shopkeepers_Locations_LocationId",
                table: "Shopkeepers");

            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_Locations_LocationId",
                table: "Vendors");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Vendors_LocationId",
                table: "Vendors");

            migrationBuilder.DropIndex(
                name: "IX_Shopkeepers_LocationId",
                table: "Shopkeepers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Shopkeepers");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Shopkeepers");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Shopkeepers");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Shopkeepers");
        }
    }
}
