# Mon API (Express+ Prisma)

Cette API permet la gestion des notes pour une application de Note .

elle est construite avec **Express.js**, **Prisma**, et **PostgreSQL**

---

## API Endpoints 

**POST** `/api/notes/`
Creeer une nouvelle note 
#### Corps JSON requis:
```json
{
    "title": "Titre de la note","content": "Contenu de la note",
    "authorName": "Nom de l'auteur (facultatif)",
    "isPublic": true
}
```

#### Reponse json 
```
{ "id": 1,
  "title": "...",
  "content": "...",
  "authorName": "...",
  "isPublic": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**GET** `/api/notes`
Recuperer tout les notes, en fonction de plusieurs parametre 

#### Query params :
- `page` : num de la page
- `limit`: nombre de resultats par page
- `search`: mot-cle dans le title ou le content 
- `sort`:  + newest (par defaut)
           + oldest
           + title_asc
           + title_desc

##### Exemple:
GET `/api/notes?page=1&limit=5&search=react&sort=title_asc`

##### Reponse: 
```
{
  "page": 2,
  "totalPages": 4,
  "totalNotes": 20,
  "notes": [ ... ]
}
```

**GET** `/api/notes/:id`
Recuperer une note par son id

#### Reponse:
```200
{
  "id": 2,
  "title": "...",
  "content": "...",
  "authorName": "...",
  "isPublic": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

``` 404
{
    "error": "Note not found!!"
}
```

**PUT** `/api/notes/:id`

#### Corps JSON requis :
```
{
  "title": "Nouveau titre",
  "content": "Nouveau contenu",
  "authorName": "Auteur modifié",
  "isPublic": false
}
```

#### Reponse:
```
{
  "id": 2,
  "title": "...",
  "content": "...",
  "authorName": "...",
  "isPublic": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**DELETE** `/api/notes/:id`
Supprimer une note par son id

#### Reponse:
```
{
  "message": "Note supprimée avec succès."
}
```

Lancement locale : nodemon app.js

