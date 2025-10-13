namespace WebServiceBackEnd.BE.CU
{
    public class ResponseBE<T>
    {
        public bool Exito { get; set; }
        public string? Mensaje { get; set; }
        public T? Data { get; set; }
    }
}
