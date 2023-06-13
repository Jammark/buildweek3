export interface User {
        id: number,
        name: string,
        username: string,
        email: string,

        phone: string,
        website: string,
        address: Address,
        company: Company,
        imageUrl?: string,

}

export interface Company{
        name: string,
        catchPhrase: string,
        bs: string,
}

export interface Address{
  street: string,
  suite: string,
  city: string,
  zipcode: string,
  geo: Geo,
}

export interface Geo{
  lat: number,
  lng: number,
}
