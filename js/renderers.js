/////////////////////Bridge Renderer////////////////

    const bridgeRenderer = {
            type: "unique-value",
            field: "TYPE_",
            visualVariables: [
                {
                    type: "size",
                    field: "SIZE_",
                    axis: "height",
                    valueUnit: "meters"
                },
                {
                    type: "rotation",
                    field: "ROTATION",
                }
            ],
            uniqueValueInfos: [
                {
                    value: "1",
                    symbol: {
                    type: "point-3d",
                    symbolLayers: [
                        {
                            type: "object",
                            resource: {
                                href: "./3d/Bridge_1.glb"
                                }
                            }
                        ]   
                    }
                },
                {
                    value: "2",
                    symbol: {
                    type: "point-3d",
                    symbolLayers: [
                        {
                            type: "object",
                            resource: {
                                href: "./3d/Bridge_2.glb"
                                }
                            }
                        ]   
                    }
                },
                {
                    value: "3",
                    symbol: {
                    type: "point-3d",
                    symbolLayers: [
                        {
                            type: "object",
                            resource: {
                                href: "./3d/Bridge_3.glb"
                                }
                            }
                        ]   
                    }
                },
                {
                    value: "4",
                    symbol: {
                    type: "point-3d",
                    symbolLayers: [
                        {
                            type: "object",
                            resource: {
                                href: "./3d/Bridge_4.glb"
                                }
                            }
                        ]   
                    }
                },
                {
                    value: "5",
                    symbol: {
                    type: "point-3d",
                    symbolLayers: [
                        {
                            type: "object",
                            resource: {
                                href: "./3d/FireTower.glb"
                                }
                            }
                        ]   
                    }
                },
                {
                    value: "6",
                    symbol: {
                    type: "point-3d",
                    symbolLayers: [
                        {
                            type: "object",
                            resource: {
                                href: "./3d/Bridge_5.glb"
                                }
                            }
                        ]   
                    }
                },
                {
                    value: "7",
                    symbol: {
                    type: "point-3d",
                    symbolLayers: [
                        {
                            type: "object",
                            resource: {
                                href: "./3d/Bridge_6.glb"
                                }
                            }
                        ]   
                    }
                }
            ]
    };  

/////////////////////Milepost Renderer////////////////

var mpVerticalOffset = {
    screenLength: 5,
    maxWorldLength: 100,
    minWorldLength: 20
};

var mpRenderer = {
        type: "simple",
        symbol: {
          type: "point-3d", 
            symbolLayers: [
              {
                type: "icon",
                material: {
                  color: [99, 99, 99]
                },
                size: 1,
                outline: {
                  color: "#404040",
                  size: 0
                }
              }
            ],

            verticalOffset: mpVerticalOffset,

            callout: {
              type: "line",
              color: [0,0,0],
              size: .5,
              border: {
                color: [255,255,255,0]
              }
            }
          }
      };

/////////////////////Intersection Renderer////////////////

var interVerticalOffset = {
    screenLength: 20,
    maxWorldLength: 100,
    minWorldLength: 25
};

function getInterIcon(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        size: 12,
        outline: {
          color: "black",
          size: 2
        }
      }
    ],

    verticalOffset: interVerticalOffset,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

var interRenderer = {
    type: "unique-value",
    field: "Type",
    uniqueValueInfos: [
        {
            value: "Interstate",
            symbol: getInterIcon(
                "img/Interstate.png"
            )
        },
        {
            value: "US Route",
            symbol: getInterIcon(
                "img/State_Route.png"
            )
        },
        {
            value: "State Route",
            symbol: getInterIcon(
                "img/State_Route.png"
            )
        }
    ]
};

/////////////////////Peak Renderer////////////////

var peakVerticalOffset = {
    screenLength: 20,
    maxWorldLength: 100,
    minWorldLength: 25
};

var peaksRenderer = {
        type: "simple",
        symbol: {
          type: "point-3d", 
            symbolLayers: [
              {
                type: "icon",
                material: {
                  color: [99, 99, 99]
                },
                size: 3,
                outline: {
                  color: "#404040",
                  size: 1
                }
              }
            ],

            verticalOffset: peakVerticalOffset,

            callout: {
              type: "line",
              color: [0,0,0],
              size: .5,
              border: {
                color: [255,255,255,0]
              }
            }
          }
      };

/////////////////////Overlook Renderer////////////////

var verticalOffset = {
    screenLength: 30,
    maxWorldLength: 650,
    minWorldLength: 150
};

function getIcon(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        /*material: {
          color: color
        },*/
        size: 11,
        outline: {
          color: "black",
          size: 4
        }
      }
    ],

    verticalOffset: verticalOffset,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

var overlookRenderer = {
    type: "unique-value",
    field: "Type",
    uniqueValueInfos: [
        {
            value: "Parkway Administration",
            symbol: getIcon(
                "img/RangerStation_White.png"
            )
        },
        {
            value: "Point of Interest",
            symbol: getIcon(
                "img/PointofInterest_White.png"
            )
        },
        {
            value: "Campground",
            symbol: getIcon(
                "img/Camping_White.png"
            )
        },
        {
            value: "Hiking",
            symbol: getIcon(
                "img/Hiking_White.png"
            )
        },
        {
            value: "Lodging",
            symbol: getIcon(
                "img/Lodging_White.png"
            )
        },
        {
            value: "Overlook",
            symbol: getIcon(
                "img/Overlook_White.png"
            )
        },
        {
            value: "Parking Area",
            symbol: getIcon(
                "img/Car_White.png"
            )
        },
        {
            value: "Picnic Area",
            symbol: getIcon(
                "img/Picnic_White.png"
            )
        },
        {
            value: "Visitor Center",
            symbol: getIcon(
                "img/Ranger_White.png"
            )
        }
    ]
};

var verticalOffsetTwo = {
    screenLength: 10,
    maxWorldLength: 350,
    minWorldLength: 100
};

function getIconTwo(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        /*material: {
          color: color
        },*/
        size: 18,
        outline: {
          color: "black",
          size: 1
        }
      }
    ],

    verticalOffset: verticalOffsetTwo,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

var overlookRendererTwo = {
    type: "unique-value",
    field: "Type",
    uniqueValueInfos: [
        {
            value: "Parkway Administration",
            symbol: getIconTwo(
                "img/RangerStation_White.png"
            )
        },
        {
            value: "Point of Interest",
            symbol: getIconTwo(
                "img/PointofInterest_White.png"
            )
        },
        {
            value: "Campground",
            symbol: getIconTwo(
                "img/Camping_White.png"
            )
        },
        {
            value: "Hiking",
            symbol: getIconTwo(
                "img/Hiking_White.png"
            )
        },
        {
            value: "Lodging",
            symbol: getIconTwo(
                "img/Lodging_White.png"
            )
        },
        {
            value: "Overlook",
            symbol: getIconTwo(
                "img/Overlook_White.png"
            )
        },
        {
            value: "Parking Area",
            symbol: getIconTwo(
                "img/Car_White.png"
            )
        },
        {
            value: "Picnic Area",
            symbol: getIconTwo(
                "img/Picnic_White.png"
            )
        },
        {
            value: "Visitor Center",
            symbol: getIconTwo(
                "img/Ranger_White.png"
            )
        }
    ]
};

///Start overlook Render Three

var verticalOffsetThree = {
    screenLength: 7,
    maxWorldLength: 250,
    minWorldLength: 50
};

function getIconThree(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        size: 27,
        outline: {
          color: "black",
          size: 1
        }
      }
    ],

    verticalOffset: verticalOffsetThree,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

var overlookRendererThree = {
    type: "unique-value",
    field: "Type",
    uniqueValueInfos: [
        {
            value: "Parkway Administration",
            symbol: getIconThree(
                "img/RangerStation_White.png"
            )
        },
        {
            value: "Point of Interest",
            symbol: getIconThree(
                "img/PointofInterest_White.png"
            )
        },
        {
            value: "Campground",
            symbol: getIconThree(
                "img/Camping_White.png"
            )
        },
        {
            value: "Hiking",
            symbol: getIconThree(
                "img/Hiking_White.png"
            )
        },
        {
            value: "Lodging",
            symbol: getIconThree(
                "img/Lodging_White.png"
            )
        },
        {
            value: "Overlook",
            symbol: getIconThree(
                "img/Overlook_White.png"
            )
        },
        {
            value: "Parking Area",
            symbol: getIconThree(
                "img/Car_White.png"
            )
        },
        {
            value: "Picnic Area",
            symbol: getIconThree(
                "img/Picnic_White.png"
            )
        },
        {
            value: "Visitor Center",
            symbol: getIconThree(
                "img/Ranger_White.png"
            )
        }
    ]
};

/////////////////////Tree Renderer////////////////

var treeRenderer = {
        type: "simple",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              resource: { 
                  primitive: "cone" 
              },
              /*material: { 
                  color: "rgb(22, 133, 8)" 
              },*/
              depth: 7,
              width: 4
            }
          ]
        },
        visualVariables: [
          {
            type: "size",
            field: "Height",
            axis: "height"
          },
          {
              type: "color",
              field: "Color",
              stops: [
                { 
                  value: 1, 
                  color: "#568f4f"
                },
                {
                  value: 7,
                  color: "#0b5920"
                }
              ]
          }
        ]
};

/////////////////////Building Renderer////////////////

function getBuildingType(buildingModel) {
    return {
            type: "point-3d",
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        href: buildingModel
                    },
                    /*height: 7,
                    anchor: "bottom"*/
                }
            ]
        }
}

var buildingRenderer = {
    type: "unique-value",
    field: "building",
    visualVariables: [
        {
            type: "size",
            field: "Size",
            axis: "height",
            valueUnit: "meters"
        },
        {
            type: "rotation",
            field: "Rotation",
            /*rotationType: "geographic",
            axis: "heading"*/
        }
    ],
    uniqueValueInfos: [
        {
            value: "Small Building",
            symbol: getBuildingType (
                "./3d/Small_Building.glb"
            ),
        },
        {
            value: "Visitor Center",
            symbol: getBuildingType (
                "./3d/VisitorCenter.glb"
            ),
        },
        {
            value: "Medium Building",
            symbol: getBuildingType (
                "./3d/Medium_Building.glb"
            ),
        },
        {
            value: "Maintenance",
            symbol: getBuildingType (
                "./3d/Maintenance.glb"
            ),
        },
        {
            value: "Tiny Building",
            symbol: getBuildingType (
                "./3d/Tiny_Building.glb"
            ),
        },
        {
            value: "Large Building",
            symbol: getBuildingType (
                "./3d/Large_Building.glb"
            ),
        },
        {
            value: "Cabin",
            symbol: getBuildingType (
                "./3d/Cabin.glb"
            ),
        },
        {
            value: "Mill",
            symbol: getBuildingType (
                "./3d/Mill.glb"
            ),
        },
        {
            value: "Administration",
            symbol: getBuildingType (
                "./3d/Administration.glb"
            ),
        },
        {
            value: "Fire Tower",
            symbol: getBuildingType (
                "./3d/FireTower.glb"
            ),
        },
        {
            value: "Church",
            symbol: getBuildingType (
                "./3d/Church.glb"
            ),
        },
        {
            value: "Cone",
            symbol: getBuildingType (
                "./3d/Cone.glb"
            ),
        },
        {
            value: "Boat",
            symbol: getBuildingType (
                "./3d/Boat.glb"
            ),
        },
        {
            value: "BoatTwo",
            symbol: getBuildingType (
                "./3d/Boat_Two.glb"
            ),
        }
    ]
};

/////////////////////Tunnel Icon Renderer////////////////


var tunvertOffset = {
    screenLength: 30,
    maxWorldLength: 600,
    minWorldLength: 150
};

function getTunIcOne(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        /*material: {
          color: color
        },*/
        size: 11,
        outline: {
          color: "black",
          size: 4
        }
      }
    ],

    verticalOffset: tunvertOffset,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

var rendTunnSmall = {
    type: "unique-value",
    field: "Type",
    uniqueValueInfos: [
        {
            value: "Tunnel",
            symbol: getTunIcOne(
                "img/Tunnel_White.png"
            )
        },
        {
            value: "Terminus",
            symbol: getTunIcOne(
                "img/Entrance_White.png"
            )
        },
        {
            value: "Maintenance Yard",
            symbol: getTunIcOne(
                "img/Maintenance_White.png"
            )
        },
        {
            value: "Parkway Administration",
            symbol: getTunIcOne(
                "img/RangerStation_White.png"
            )
        }
    ]
};

var tunvertOffsetTwo = {
    screenLength: 30,
    maxWorldLength: 550,
    minWorldLength: 120
};

function getTunIcTwo(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        /*material: {
          color: color
        },*/
        size: 18,
        outline: {
          color: "black",
          size: 2
        }
      }
    ],

    verticalOffset: tunvertOffsetTwo,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

var rendTunnMedium = {
    type: "unique-value",
    field: "Type",
    uniqueValueInfos: [
        {
            value: "Tunnel",
            symbol: getTunIcTwo(
                "img/Tunnel_White.png"
            )
        },
        {
            value: "Terminus",
            symbol: getTunIcTwo(
                "img/Entrance_White.png"
            )
        },
        {
            value: "Maintenance Yard",
            symbol: getTunIcTwo(
                "img/Maintenance_White.png"
            )
        },
        {
            value: "Parkway Administration",
            symbol: getTunIcTwo(
                "img/RangerStation_White.png"
            )
        }
    ]
};

var tunvertOffsetThree = {
    screenLength: 10,
    maxWorldLength: 350,
    minWorldLength: 75
};

function getTunIcThree(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        /*material: {
          color: color
        },*/
        size: 27,
        outline: {
          color: "black",
          size: 2
        }
      }
    ],

    verticalOffset: tunvertOffsetThree,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

var rendTunnLarge = {
    type: "unique-value",
    field: "Type",
    uniqueValueInfos: [
        {
            value: "Tunnel",
            symbol: getTunIcThree(
                "img/Tunnel_White.png"
            )
        },
        {
            value: "Terminus",
            symbol: getTunIcThree(
                "img/Entrance_White.png"
            )
        },
        {
            value: "Maintenance Yard",
            symbol: getTunIcThree(
                "img/Maintenance_White.png"
            )
        },
        {
            value: "Parkway Administration",
            symbol: getTunIcThree(
                "img/RangerStation_White.png"
            )
        }
    ]
};

