package co.edu.sena.pasantix.modelo;

import java.time.LocalDateTime;

/**
 * Clase de modelo (POJO) que representa una fila de la tabla "empresas".
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
public class Empresa {

    private int idEmpresa;
    private String nit;
    private String razonSocial;
    private String sector;
    private String correo;
    private String telefono;
    private String ciudad;
    private LocalDateTime fechaRegistro;

    /** Constructor vacío requerido para crear el objeto paso a paso. */
    public Empresa() {
    }

    /** Constructor con los datos que digita el usuario. */
    public Empresa(String nit, String razonSocial, String sector, String correo, String telefono, String ciudad) {
        this.nit = nit;
        this.razonSocial = razonSocial;
        this.sector = sector;
        this.correo = correo;
        this.telefono = telefono;
        this.ciudad = ciudad;
    }

    public int getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(int idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    @Override
    public String toString() {
        return String.format("%-4d %-13s %-32s %-14s %-26s %-11s %s",
                idEmpresa, nit, razonSocial, valorOGuion(sector), correo, valorOGuion(telefono), ciudad);
    }

    private static String valorOGuion(String valor) {
        return valor == null || valor.isBlank() ? "-" : valor;
    }
}
