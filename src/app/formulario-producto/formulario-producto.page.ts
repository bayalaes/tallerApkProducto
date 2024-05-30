import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.page.html',
  styleUrls: ['./formulario-producto.page.scss'],
})
export class FormularioProductoPage implements OnInit {
  formularioProducto: FormGroup;
  id: number | null = null;
  

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formularioProducto = this.fb.group({
      presupuesto: ['', Validators.required],
      unidad: ['', Validators.required],
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required],
      valorUnitario: ['', Validators.required],
      valorTotal: [{ value: '', disabled: true }],
      fechaAdquisicion: ['', Validators.required],
      proveedor: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id;
        this.productoService.obtenerProducto(this.id).subscribe(producto => {
          this.formularioProducto.patchValue(producto);
        });
      }
    });

    this.formularioProducto.get('cantidad')?.valueChanges.subscribe(value => this.actualizarValorTotal());
    this.formularioProducto.get('valorUnitario')?.valueChanges.subscribe(value => this.actualizarValorTotal());
  }

  actualizarValorTotal() {
    const cantidad = this.formularioProducto.get('cantidad')?.value;
    const valorUnitario = this.formularioProducto.get('valorUnitario')?.value;
    if (cantidad !== null && valorUnitario !== null) {
      this.formularioProducto.get('valorTotal')?.setValue(cantidad * valorUnitario);
    }
  }

  onSubmit() {
    if (this.formularioProducto.valid) {
      if (this.id !== null) {
        this.productoService.actualizarProducto(this.id, this.formularioProducto.value).subscribe(() => {
          this.router.navigate(['/lista-productos']);
        });
      } else {
        this.productoService.crearProducto(this.formularioProducto.value).subscribe(() => {
          this.router.navigate(['/lista-productos']);
        });
      }
    }
  }
  regresar() {
    this.router.navigate(['/lista-productos']);
  }
}
