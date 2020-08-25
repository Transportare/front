import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '@models/usuario';
import { UsuariosService } from '@services/modulos/gestion/mantenimientos/usuarios/usuarios.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MensajeResponseService } from '@services/utils/mensajeresponse.service';
declare var $: any;

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
    @ViewChild('modalUsuario', { static: false }) modalUsuario: ElementRef;
    @ViewChild('modalPass', { static: false }) modalPass: ElementRef;
    selectItem: Usuario;
    usuarios: Usuario[];
    privilegios: TreeviewItem[];
    loading: boolean;
    estados: any[];
    estadoSelected: any;
    perfiles: any[];
    perfilSelected: any;
    formUsuario: FormGroup;
    formPass: FormGroup;
    msj$: Subscription;
    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: true,
        decoupleChildFromParent: false,
        maxHeight: 400,
    });

    private dniValidator = [Validators.required, Validators.minLength(8)];
    // private itemsValidator = Validators.required;

    constructor(
        private router: Router,
        private usuarioService: UsuariosService,
        private mensajeResponse: MensajeResponseService,
        private fb: FormBuilder
    ) {
        this.usuarios = [];
        this.privilegios = [];
        this.estados = [
            { id: 1, text: 'Activo' },
            { id: 0, text: 'Inactivo' },
        ];
        this.perfiles = [];
        this.usuarioService.getPerfiles().subscribe((response: any) => {
            this.perfiles = response;
        });
        this.perfilSelected = { id: '', text: 'Seleccionar Perfil' };
        this.estadoSelected = {};
        this.selectItem = new Usuario();
        this.loading = false;
    }

    ngOnInit() {
        this.initForm();
        this.listar();
    }

    ngOnDestroy(): void {
        if (this.msj$) {
            this.msj$.unsubscribe();
        }
    }

    listar() {
        this.loading = true;
        this.usuarioService.getUsuarios().subscribe(
            (response) => {
                this.usuarios = response;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    initForm() {
        this.formPass = this.fb.group(
            {
                password1: ['', Validators.required],
                password2: ['', Validators.required],
            },
            {
                validators: this.passwordsIguales('password1', 'password2'),
            }
        );
        this.formUsuario = this.fb.group({
            usuario: ['', Validators.required],
            dni: ['', this.dniValidator],
            password: ['', Validators.required],
            perfil: ['', Validators.required],
        });
    }

    get pass1NoValido() {
        return this.formPass.get('password1').invalid && this.formPass.get('password1').touched;
    }

    get pass2NoValido() {
        const password1 = this.formPass.get('password1').value;
        const password2 = this.formPass.get('password2').value;
        return password1 === password2 ? false : true;
    }

    passwordsIguales(password1: string, password2: string) {
        return (formGroup: FormGroup) => {
            const pass1 = formGroup.controls[password1];
            const pass2 = formGroup.controls[password2];

            if (pass1.value === pass2.value) {
                pass2.setErrors(null);
            } else {
                pass2.setErrors({ noIguales: true });
            }
        };
    }

    getPrivilegios(item) {
        this.loading = true;
        this.selectItem = item;
        this.usuarioService.getPerfilByUser(this.selectItem.idUsuario).subscribe(
            (response) => {
                this.privilegios = response;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    nuevo() {
        this.selectItem = new Usuario();
        this.verificarValidaciones();
        $(this.modalUsuario.nativeElement).modal('show');
    }

    editar() {
        this.verificarValidaciones();
        this.formUsuario.patchValue({
            dni: this.selectItem.dni,
            perfil: this.selectItem.perfil,
        });
        this.perfilSelected = { id: this.selectItem.perfil, text: this.selectItem.nombrePerfil };
        this.estadoSelected = this.estados.find((e) => e.id === this.selectItem.estado);
        $(this.modalUsuario.nativeElement).modal('show');
    }

    verificarValidaciones() {
        if (this.selectItem.idUsuario) {
            this.formUsuario.get('usuario').clearValidators();
            this.formUsuario.get('password').clearValidators();
            this.formUsuario.get('usuario').updateValueAndValidity();
            this.formUsuario.get('password').updateValueAndValidity();
        } else {
            this.formUsuario.get('usuario').setValidators(Validators.required);
            this.formUsuario.get('password').setValidators(Validators.required);
            this.formUsuario.get('perfil').setValidators(Validators.required);
            this.formUsuario.get('usuario').updateValueAndValidity();
            this.formUsuario.get('password').updateValueAndValidity();
            this.formUsuario.get('perfil').updateValueAndValidity();
        }
    }

    cerrarModal() {
        $(this.modalUsuario.nativeElement).modal('hide');
        this.formUsuario.reset();
        this.perfilSelected = { id: '', text: 'Seleccionar Perfil' };
        this.selectItem = new Usuario();
    }

    // Cambiar Contraseña

    cambiarPass() {
        $(this.modalPass.nativeElement).modal('show');
    }

    generarPass() {
        this.usuarioService.putPassword(this.selectItem.idUsuario, { pass: this.formPass.value.password2 }).subscribe(
            (response) => {
                this.cerrarModal();
                this.msj$ = this.mensajeResponse.succes('Contraseña actualizada correctamente').subscribe((action) => {
                    if (action) {
                        this.selectItem = new Usuario();
                        this.cerrarModalPass();
                    }
                });
            },
            (error) => {
                this.msj$ = this.mensajeResponse.danger().subscribe();
            }
        );
    }

    cerrarModalPass() {
        $(this.modalPass.nativeElement).modal('hide');
        this.formPass.reset();
        this.selectItem = new Usuario();
    }

    //

    generarUsuario() {
        const usuario: Usuario = new Usuario();
        if (!this.selectItem.idUsuario) {
            // Nuevo
            this.usuarioService.postUsuario({ ...usuario, ...this.formUsuario.value }).subscribe(
                (response) => {
                    this.cerrarModal();
                    this.msj$ = this.mensajeResponse.succes('Usuario creado correctamente').subscribe((action) => {
                        if (action) {
                            this.listar();
                            this.selectItem = new Usuario();
                        }
                    });
                },
                (error) => {
                    this.msj$ = this.mensajeResponse.danger().subscribe();
                }
            );
        } else {
            // Editar
            this.usuarioService
                .putPerfil({ ...usuario, ...this.formUsuario.value, estado: this.estadoSelected.id }, this.selectItem.idUsuario)
                .subscribe(
                    (response) => {
                        this.cerrarModal();
                        this.msj$ = this.mensajeResponse.succes('Usuario actualizado correctamente').subscribe((action) => {
                            if (action) {
                                this.listar();
                                this.selectItem = new Usuario();
                            }
                        });
                    },
                    (error) => {
                        this.msj$ = this.mensajeResponse.danger().subscribe();
                    }
                );
        }
    }
}
