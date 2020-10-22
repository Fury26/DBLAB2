import React, {Fragment} from 'react'
import './styles.css'
import { Card } from './Card'

export const MainMenu = () => {
    return (
        <Fragment>
            <div className="d-flex flex-wrap">
                <Card link="/club" tableName="club" img="Barca" />
                <Card link="/player" tableName="player" img="Messi2" />
                <Card link="/stadium" tableName="stadium" img="Stadium" />
                <Card link="/tournament" tableName="tournament" img="UCL" />
                <Card link="/match" tableName="match" img="match" />
                <Card link="/club_stadium" tableName="club_stadium" img="Stadium" />
                <Card link="/clubs_tournaments" tableName="clubs_tournaments" img="UCL" />
            </div>
        </Fragment>
    )
}

