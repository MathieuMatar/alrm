import { DataTypes, Model } from 'sequelize';
import sequelize from './config/db-sequelize.js';

// Accomodation Model
class Accomodation extends Model { }
Accomodation.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    tag: DataTypes.STRING(50),
    description: DataTypes.TEXT,
    story: DataTypes.TEXT,
    features: {
      type: DataTypes.JSON,
      defaultValue: '[]',
    }
  },
  {
    sequelize,
    modelName: 'Accomodation',
  }
);

// Venue Model
class Venue extends Model { }
Venue.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    features: DataTypes.JSON,
    events: DataTypes.JSON,
    surface: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'Venue',
  }
);

// Room Model
class Room extends Model { }
Room.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    features: DataTypes.JSON,
  },
  {
    sequelize,
    modelName: 'Room',
  }
);

// Other Model
class Other extends Model { }
Other.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('activities', 'nightlife', 'occasions', 'intro'),
      allowNull: false,
    },
    description: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'Other',
  }
);

class Map extends Model { }
Map.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    left: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('accomodation', 'room', 'activity', 'venue', 'other'),
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Map',
  }
)

class Page extends Model {}

Page.init(
  {
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    html: {
      type: DataTypes.TEXT('long'), // for full HTML content
      allowNull: false,
    },
    meta_title: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    meta_keyword: {
      type: DataTypes.STRING(255), // optional, even though not used much by SEO anymore
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING(255), 
      allowNull: true,
      // store the **URL or file path** instead of blob
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Page',
  }
);



// Set up associations
Accomodation.hasMany(Room, {
  foreignKey: { name: 'accomodationId', allowNull: false },
  onDelete: 'CASCADE',
});
Room.belongsTo(Accomodation, {
  foreignKey: { name: 'accomodationId', allowNull: false },
});

export { Accomodation, Venue, Room, Other, Map, Page };
