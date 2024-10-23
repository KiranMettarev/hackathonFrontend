import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { LocalStorageService } from "../../services/local-storage.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorage: LocalStorageService,
  ) {}

  userFullName: string = "";
  nameInitial: string = "";
  selectedMenuIndex = 0;
  showMenu = false;

  async ngOnInit(): Promise<void> {}

  menuItemClick(
    { route: menuRoute }: { title: string; route: string },
    selectedMenuIndex: number,
  ): void {
    this.selectedMenuIndex = selectedMenuIndex;
    this.router.navigate([menuRoute]);
  }

  async logOut(): Promise<void> {
    try {
      // await firstValueFrom(this.authService.logout());
      this.localStorage.remove("auth")
      this.router.navigate([""]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // TODO show snack bar with appropriate error
      alert("Your session has expired. Please log in again.");
    }
  }


  closeMenu(): void {
    this.showMenu = false;
  }


  formatRole(role: string): string {
    if (role.toLowerCase() === "dsa") {
      return role.toUpperCase();
    }

    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

