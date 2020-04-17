import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumsComponent } from './breadcrums/breadcrums.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [NavbarComponent, SidebarComponent, BreadcrumsComponent],
    imports: [CommonModule, RouterModule],
    exports: [NavbarComponent, SidebarComponent, BreadcrumsComponent],
})
export class SharedModule {}
